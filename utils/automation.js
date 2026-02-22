import { AutomationWorkflow } from '../models/index.js';
import axios from 'axios';

/**
 * Trigger active automation workflows for a specific event.
 * @param {string} event - The trigger event (e.g., 'new_order', 'new_user')
 * @param {object} data - The payload to send
 */
export const triggerAutomation = async (event, data) => {
    try {
        const workflows = await AutomationWorkflow.findAll({
            where: {
                trigger_event: event,
                is_active: true
            }
        });

        const promises = workflows.map(async (wf) => {
            try {
                await axios.post(wf.webhook_url, {
                    event,
                    timestamp: new Date().toISOString(),
                    data
                });
                await wf.update({ last_triggered: new Date() });
            } catch (err) {
                console.error(`Automation trigger failed for ${wf.name}:`, err.message);
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Automation engine error:', error.message);
    }
};
