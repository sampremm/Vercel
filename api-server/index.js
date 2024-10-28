const express = require('express');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');

const app = express();
const PORT = 9000;
app.use(express.json());

const ecsClient = new ECSClient({
    region:'ap-south-1',
    credentials: {
        accessKeyId:'AKIAQR5EPL6JH7PPPBAC',
        secretAccessKey:'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'
    }
});

const config = {
    CLUSTER: 'arn:aws:ecs:ap-south-1:038462775186:cluster/builder-cluster',
    TASK: 'arn:aws:ecs:ap-south-1:038462775186:task-definition/builder-task-1'
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
                subnets: ['subnet-0317809186cd3798c', 'subnet-0c5334a79b72e0e68', 'subnet-02fe62235fdadcf71'],
                securityGroups: ['sg-034c5da0521157cf7']
            }
        },
        overrides:{
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
    } catch (error) {
        console.error('Error launching task:', error);
        res.status(500).json({ status: 'error', message: 'Failed to queue the project.' });
    }
});



app.listen(PORT, () => console.log(`API Server Running on port ${PORT}`));
