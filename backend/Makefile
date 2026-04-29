# ─────────────────────────────────────────────
#  Telecom Churn API — Makefile
#  Usage: make <target>
# ─────────────────────────────────────────────

.PHONY: dev start install lint help

## Start dev server with hot-reload
dev:
	uvicorn api.main:app --reload --host 127.0.0.1 --port 8000

## Start production server (no reload)
start:
	uvicorn api.main:app --host 127.0.0.1 --port 8000

## Install all Python dependencies
install:
	pip install -r requirements.txt

## Show available commands
help:
	@echo ""
	@echo "  make dev      → Start dev server (hot-reload on :8000)"
	@echo "  make start    → Start production server"
	@echo "  make install  → pip install -r requirements.txt"
	@echo ""


# venv is activated -> It means my 1st priority is rto check if the script of termianl like pip is inside the venv 