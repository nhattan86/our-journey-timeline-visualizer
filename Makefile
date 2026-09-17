# ==============================================================================
# Makefile - Our Journey Timeline Visualizer
# Quy trình kiểm thử hình thức, đóng gói và triển khai tự động lên GitHub Pages
# ==============================================================================

SHELL := cmd.exe
COMMIT_MSG ?= Deploy to GitHub Pages: production release and documentation update

.PHONY: all test build status deploy clean help

all: test build

## test: Chay toan bo 27 formal test cases theo chuan Popperian Falsificationism
test:
	node --test tests/*.test.js

## build: Kiem tra tinh toan ven cua our-journey.html va index.html
build:
	node scripts/build-standalone.js

## status: Hien thi trang thai Git hien thoi
status:
	git status

## deploy: Chay test -> build -> commit tat ca thay doi -> push len origin main
deploy: test build
	git add -A
	git commit -m "$(COMMIT_MSG)" || echo Khong co thay doi moi de commit.
	git push origin main
	@echo.
	@echo [DEPLOY HOAN TAT] Ung dung da duoc push len origin main thanh cong!
	@echo Truy cap: https://nhattan86.github.io/our-journey-timeline-visualizer/

## clean: Don dep cac tep nhat ky tam thoi
clean:
	@echo [CLEAN] Khong co tep rac can don dep.

## help: Hien thi danh sach cac lenh make kha dung
help:
	@echo ==============================================================================
	@echo Danh sach cac lenh ho tro:
	@echo   make test    - Chay toan bo bo kiem thu tu dong (27/27 test cases)
	@echo   make build   - Kiem tra toan ven our-journey.html va tệp chuyen huong index.html
	@echo   make status  - Kiem tra tinh trang git hien tai
	@echo   make deploy  - Chay test, build, stage tat ca (git add -A), commit va push main
	@echo   make clean   - Don dep cac tep tam thoi
	@echo ==============================================================================
