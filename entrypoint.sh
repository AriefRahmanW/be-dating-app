#!/bin/sh

pnpm prisma migrate deploy
pnpm prisma db seed

exec "$@"