# Stage 1: Build Rust app
FROM rust:1.68.2 as builder

WORKDIR /api
COPY . .

RUN cargo build --release

# Stage 2: Start app
FROM scratch

WORKDIR /api
COPY --from=builder /api/target/release/polynotes-backend /api/polynotes-api

ENV RUST_LOG="polynotes_backend=trace"
CMD ["/api/polynotes-api"]
