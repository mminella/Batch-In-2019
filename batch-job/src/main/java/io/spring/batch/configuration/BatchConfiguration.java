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

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManagerFactory;

import io.spring.batch.Person;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.DefaultBatchConfigurer;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

/**
 * @author Michael Minella
 * @author Mahmoud Ben Hassine
 */
@Configuration
public class BatchConfiguration extends DefaultBatchConfigurer {

	private final JobBuilderFactory jobBuilderFactory;

	private final StepBuilderFactory stepBuilderFactory;

	private final EntityManagerFactory entityManagerFactory;

	private final JdbcTemplate jdbcTemplate;

	public BatchConfiguration(EntityManagerFactory entityManagerFactory, JdbcTemplate jdbcTemplate,
							  JobBuilderFactory jobBuilderFactory, StepBuilderFactory stepBuilderFactory) {
		this.entityManagerFactory = entityManagerFactory;
		this.jdbcTemplate = jdbcTemplate;
		this.jobBuilderFactory = jobBuilderFactory;
		this.stepBuilderFactory = stepBuilderFactory;
	}

	@Bean
	public Job job() {
		return this.jobBuilderFactory.get("job")
				.start(step1())
				.next(step2())
				.incrementer(new RunIdIncrementer())
				.build();
	}

	@Bean
	public Step step1() {
		return this.stepBuilderFactory.get("step1")
				.<Person, Person>chunk(1000)
				.reader(itemReader())
				.writer(itemWriter())
				.build();
	}

	@Bean
	public ListItemReader<Person> itemReader() {
		List<Person> items = new ArrayList<>();
		for (int i = 0; i < 1_000_000; i++) {
			items.add(new Person("foo" + i));
		}
		return new ListItemReader<>(items);
	}

	@Bean
	public JpaItemWriter<Person> itemWriter() {
		JpaItemWriter<Person> writer = new JpaItemWriter<>();
		writer.setEntityManagerFactory(this.entityManagerFactory);
		writer.setUsePersist(true);
		return writer;
	}

	@Bean
	public Step step2() {
		return this.stepBuilderFactory.get("step2")
				.tasklet((stepContribution, chunkContext) ->  {
					String countQuery = "select count(id) from person";
					Integer nbPersonsPersisted = this.jdbcTemplate.queryForObject(countQuery, Integer.class);
					System.out.println(String.format("%s persons have been persisted", nbPersonsPersisted));
					return RepeatStatus.FINISHED;
				})
				.build();
	}

	@Override
	public PlatformTransactionManager getTransactionManager() {
		return new JpaTransactionManager(this.entityManagerFactory);
	}

}
