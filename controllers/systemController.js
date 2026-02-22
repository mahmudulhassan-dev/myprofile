import si from 'systeminformation';
import { Setting } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';

export const getSystemStats = catchAsync(async (req, res) => {
    const [cpu, mem, fsSize, networkStats, processes] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.networkStats(),
        si.processes()
    ]);

    const stats = {
        cpu: {
            load: Math.round(cpu.currentLoad),
            user: Math.round(cpu.currentLoadUser),
            system: Math.round(cpu.currentLoadSystem),
            cores: cpu.cpus.map(c => Math.round(c.load))
        },
        mem: {
            total: mem.total,
            used: mem.active,
            free: mem.available,
            usedPercent: Math.round((mem.active / mem.total) * 100)
        },
        storage: fsSize.map(disk => ({
            fs: disk.fs,
            type: disk.type,
            size: disk.size,
            used: disk.used,
            usePercent: Math.round(disk.use),
            mount: disk.mount
        })),
        network: {
            iface: networkStats[0]?.iface || 'all',
            rx_sec: Math.round(networkStats.reduce((acc, curr) => acc + (curr.rx_sec || 0), 0)),
            tx_sec: Math.round(networkStats.reduce((acc, curr) => acc + (curr.tx_sec || 0), 0)),
        },
        processes: {
            total: processes.all,
            running: processes.running,
            list: processes.list
                .sort((a, b) => b.cpu - a.cpu)
                .slice(0, 5)
                .map(p => ({ pid: p.pid, name: p.name, cpu: Math.round(p.cpu), mem: Math.round(p.mem) }))
        },
        uptime: si.time().uptime
    };

    res.json(stats);
});

export const getSettingsByGroup = catchAsync(async (req, res) => {
    const { group } = req.params;
    const settings = await Setting.findAll({ where: { group } });
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    res.json(settingsMap);
});

export const updateSettings = catchAsync(async (req, res) => {
    const { settings, group } = req.body;
    const promises = Object.keys(settings).map(key =>
        Setting.upsert({ key, value: String(settings[key]), group })
    );
    await Promise.all(promises);
    res.json({ success: true, message: 'Settings updated' });
});
