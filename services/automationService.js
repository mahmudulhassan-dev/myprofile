import axios from 'axios';
import { AutomationWorkflow } from '../models/index.js';

class AutomationService {
    /**
     * Trigger workflows for a specific event
     * @param {string} event - The event key (e.g., 'new_booking')
     * @param {object} payload - The data to send to n8n
     */
    async trigger(event, payload) {
        try {
            const workflows = await AutomationWorkflow.findAll({
                where: {
                    trigger_event: event,
                    is_active: true
                }
            });

            if (workflows.length === 0) return;

            console.log(`[Automation] Triggering ${workflows.length} workflows for event: ${event}`);

            const promises = workflows.map(workflow => {
                return axios.post(workflow.webhook_url, {
                    event,
                    timestamp: new Date().toISOString(),
                    data: payload
                }).then(() => {
                    return workflow.update({ last_triggered: new Date() });
                }).catch(err => {
                    console.error(`[Automation] Workflow "${workflow.name}" failed:`, err.message);
                });
            });

            await Promise.all(promises);
        } catch (error) {
            console.error('[Automation] Critical Service Error:', error);
        }
    }
}

export default new AutomationService();
