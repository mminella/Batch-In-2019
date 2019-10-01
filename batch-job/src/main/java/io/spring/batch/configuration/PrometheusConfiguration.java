/*
 * Copyright 2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.spring.batch.configuration;

import org.springframework.context.annotation.Configuration;

/**
 * @author Michael Minella
 */
@Configuration
public class PrometheusConfiguration {

//	@Bean
//	public LoggingMeterRegistry loggingMeterRegistry() {
//		return new LoggingMeterRegistry();
//	}

//	@Bean
//	public PrometheusPushGatewayManager prometheusPushGatewayManager(
//			CollectorRegistry collectorRegistry,
//			PrometheusProperties prometheusProperties, Environment environment) throws MalformedURLException {
//		PrometheusProperties.Pushgateway properties = prometheusProperties
//				.getPushgateway();
//		PushGateway pushGateway = new PushGateway(new URL(properties.getBaseUrl()));
//		Duration pushRate = properties.getPushRate();
//		String job = getJob(properties, environment);
//		Map<String, String> groupingKey = properties.getGroupingKey();
//		PrometheusPushGatewayManager.ShutdownOperation shutdownOperation = properties.getShutdownOperation();
//		return new PrometheusPushGatewayManager(pushGateway, collectorRegistry,
//				pushRate, job, groupingKey, shutdownOperation);
//	}
//
//	private String getJob(PrometheusProperties.Pushgateway properties,
//			Environment environment) {
//		String job = properties.getJob();
//		job = (job != null) ? job
//				: environment.getProperty("spring.application.name");
//		return (job != null) ? job : "spring";
//	}
}
