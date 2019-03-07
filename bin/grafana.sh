docker run -i -p 3000:3000 \
-v $(pwd)/grafana-datasource.yml:/etc/grafana/provisioning/datasources/grafana-datasource.yml \
-v $(pwd)/grafana-dashboard.yml:/etc/grafana/provisioning/dashboards/grafana-dashboard.yml \
-v $(pwd)/spring-batch-dashboard.json:/etc/grafana/dashboards/batch.json \
grafana/grafana:5.1.0