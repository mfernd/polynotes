# Stage 1: Build Rust app
FROM rust:1.68.2 as builder

WORKDIR /api
COPY . .

RUN cargo build --release

# Stage 2: Start app
FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /api
COPY --from=builder /api/target/release/polynotes-backend /api/polynotes-api
RUN ls /api

ENV RUST_LOG="polynotes_backend=trace"
CMD ["./polynotes-api"]
