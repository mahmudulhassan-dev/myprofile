import { AutomationWorkflow, AutomationTrigger, AutomationAction, AutomationLog } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';

export const getWorkflows = catchAsync(async (req, res) => {
    const workflows = await AutomationWorkflow.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.json(workflows);
});

export const createWorkflow = catchAsync(async (req, res) => {
    if (!req.body.name || !req.body.webhook_url) {
        return res.status(400).json({ error: 'Name and Webhook URL are required' });
    }
    const workflow = await AutomationWorkflow.create(req.body);
    res.status(201).json(workflow);
});

export const updateWorkflow = catchAsync(async (req, res) => {
    const workflow = await AutomationWorkflow.findByPk(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Not found' });
    await workflow.update(req.body);
    res.json(workflow);
});

export const deleteWorkflow = catchAsync(async (req, res) => {
    const result = await AutomationWorkflow.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
});

export const testWorkflow = catchAsync(async (req, res) => {
    const workflow = await AutomationWorkflow.findByPk(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Not found' });

    const mockPayload = {
        id: 'test-123',
        test: true,
        message: 'This is a test trigger from Antigravity Automation Hub'
    };

    const axios = (await import('axios')).default;
    await axios.post(workflow.webhook_url, {
        event: 'test_connection',
        timestamp: new Date().toISOString(),
        data: mockPayload
    });

    await workflow.update({ last_triggered: new Date() });
    res.json({ message: 'Test trigger sent successfully' });
});
