# make: builds and runs the docker-compose file
# make build: builds the docker-compose file
# make up: runs the docker-compose file
# make down: stops the docker-compose file
# make stop: stops the docker-compose file
# make start: starts the docker-compose file
# make clean: stops the docker-compose file and removes all images and volumes
# make full_clean: stops the docker-compose file and removes all images, volumes, and prunes the docker system
# make clean_build: removes all dangling images

#             *************   simply use make **************
RED=\033[0;31m
GREEN=\033[0;32m
NO_COLOR=\033[0m

DOCKER_COMPOSE_PATH="./docker-compose.yml"

.PHONY: build up

all : build up

build:
	docker compose -f ./docker-compose.yml build --no-cache

up :
	@docker compose -f ./docker-compose.yml up -d
	@if [ $$? -eq 0 ]; then \
		echo "                                 $(RED)TRANSENDENCE IS READY$(NO_COLOR)"; \
	else \
		echo "The compose failed to execute."; \
	fi

down : 
	docker compose -f ./docker-compose.yml down

stop : 
	docker compose -f ./docker-compose.yml stop

start : 
	docker compose -f ./docker-compose.yml start

clean : 
	docker compose -f ./docker-compose.yml down
	@if [ -n "$$(docker images -a -q)" ]; then \
		docker rmi -f $$(docker images -a -q); \
	else \
		echo "No images to remove"; \
	fi
	@if [ -n "$$(docker volume ls -q)" ]; then \
		docker volume rm -f $$(docker volume ls -q); \
	else \
		echo "No volumes to remove"; \
	fi

full_clean : clean
	docker system prune -a --volumes -f
	docker volume prune -f

.DEFAULT_GOAL := all
