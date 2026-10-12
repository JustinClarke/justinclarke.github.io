.PHONY: dev build test lint kill-servers kill

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

# Kills all dev servers listening on common development ports (3000, 3001, 5173, 8000, 8080)
kill-servers:
	@echo "Killing all dev servers on ports 3000, 3001, 5173, 8000, 8080..."
	@lsof -ti :3000 -ti :3001 -ti :5173 -ti :8000 -ti :8080 | xargs kill -9 2>/dev/null || true
	@pkill -f "vite" 2>/dev/null || true
	@echo "All dev servers stopped."

kill: kill-servers
