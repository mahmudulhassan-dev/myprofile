import si from 'systeminformation';

export const getSystemStats = async (req, res) => {
    try {
        const [cpu, mem, fsSize, networkStats, processes] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.processes()
        ]);

        // Format data for frontend
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
                iface: networkStats[0]?.iface || 'eth0',
                rx_sec: Math.round(networkStats[0]?.rx_sec || 0), // Bytes per sec down
                tx_sec: Math.round(networkStats[0]?.tx_sec || 0), // Bytes per sec up
            },
            processes: {
                total: processes.all,
                running: processes.running,
                list: processes.list
                    .sort((a, b) => b.cpu - a.cpu)
                    .slice(0, 5) // Top 5 CPU consumers
                    .map(p => ({
                        pid: p.pid,
                        name: p.name,
                        cpu: Math.round(p.cpu),
                        mem: Math.round(p.mem)
                    }))
            },
            uptime: si.time().uptime
        };

        res.json(stats);
    } catch (error) {
        console.error('System Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch system stats' });
    }
};
