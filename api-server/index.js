require('dotenv').config();
const express = require('express');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');

const app = express();
const PORT = process.env.PORT || 9000;
app.use(express.json());

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const config = {
    CLUSTER: process.env.ECS_CLUSTER_ARN,
    TASK: process.env.ECS_TASK_ARN
};

app.post('/project', async (req, res) => {
    const { gitURL, slug } = req.body;
    const projectSlug = slug ? slug : generateSlug();

    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: process.env.SUBNET_IDS.split(','),
                securityGroups: [process.env.SECURITY_GROUP_ID]
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name:'builder-img', 
                    environment: [
                        { name: 'GIT_REPOSITORY__URL', value: gitURL }, 
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    });

    try {
        await ecsClient.send(command);
        res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } });
    } catch (error){
        console.error('Error launching task:', error);
        res.status(500).json({ status: 'error', message: 'Failed to queue the project.' });
    }
});

app.listen(PORT, () => console.log(`API Server Running on port ${PORT}`));
