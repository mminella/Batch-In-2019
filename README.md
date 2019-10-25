[![CircleCI](https://circleci.com/gh/mminella/Batch-In-2019/tree/s1p.svg?style=svg)](https://circleci.com/gh/mminella/Batch-In-2019/tree/s1p)

# Batch-In-2019
The repository for my talk titled the same

# Running the demo:

1. Delete apps if needed
    ```
    cf delete mminella-grafana
    cf delete mminella-pushgateway
    cf delete mminella-prometheus
    cf delete mminella-data-flow-server
    cf delete mminella-skipper-server
    ```
1. Push apps
    ```
    cd bin
    cf push -f server.yml
    ```
1. Register task application
    ```
    Name: deloit-job
    Type: Task
    URI: maven://com.github.mminella.Batch-in-2019:batch-job:8b81db0c150fb77f7bd91a3015022856dfcc0041
    ```
1. Create Task
    ```
    deloit-task
    ```
1. Schedule Task
    ```
    deloit-schedule
    ```

    
# DB Cleanup
```
DELETE FROM BATCH_STEP_EXECUTION_CONTEXT;
DELETE FROM BATCH_STEP_EXECUTION;
DELETE FROM BATCH_JOB_EXECUTION_CONTEXT;
DELETE FROM BATCH_JOB_EXECUTION_PARAMS;
DELETE FROM BATCH_JOB_EXECUTION;
DELETE FROM BATCH_JOB_INSTANCE;
DELETE FROM TASK_LOCK;
DELETE FROM TASK_TASK_BATCH;
DELETE FROM TASK_EXECUTION_PARAMS;
DELETE FROM TASK_EXECUTION;
```

cron expression:
*/1 * ? * *



            PROJECT_VERSION=$(mvn help:evaluate -Dexpression=project.version -q -DforceStdout)
            APP_BODY="uri=maven%3A%2F%2Fio.spring.batch%3Abatch-job%3A$PROJECT_VERSION"
            curl 'https://mminella-data-flow-server.apps.pcfone.io/tasks/definitions/devnexus-job' -i -X DELETE
            curl 'https://mminella-data-flow-server.apps.pcfone.io/apps/task/batch-job' -i -X DELETE
            curl 'https://mminella-data-flow-server.apps.pcfone.io/apps/task/batch-job' -i -X POST -d $APP_BODY
            curl 'https://mminella-data-flow-server.apps.pcfone.io/tasks/definitions' -i -X POST -d 'name=devnexus-job&definition=batch-job'



Grafana default auth: admin/admin