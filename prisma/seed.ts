import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function hashPassword(password: string){
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword
}

async function main(){
    await prisma.user.createMany({
        data: [
            {
                email: "jhondoe@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Jhon Doe",
                gender: "MALE"
            },
            {
                email: "alice@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Alice",
                gender: "FEMALE"
            },
            {
                email: "yanto@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Yanto",
                gender: "MALE"
            },
            {
                email: "mawar@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Mawar",
                gender: "FEMALE"
            },
            {
                email: "tiara@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Tiara",
                gender: "FEMALE"
            },
            {
                email: "nia@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Nia",
                gender: "FEMALE"
            },
            {
                email: "laras@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Laras",
                gender: "FEMALE"
            },
            {
                email: "ziva@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Ziva",
                gender: "FEMALE"
            },
            {
                email: "Ningsih@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Ningsih",
                gender: "FEMALE"
            },
            {
                email: "Bella@gmail.com",
                password: await hashPassword("!Password123"),
                name: "Bella",
                gender: "FEMALE"
            },
            {
                email: "nabila@gmail.com",
                password: await hashPassword("!Password123"),
                name: "nabila",
                gender: "FEMALE"
            },
            {
                email: "salma@gmail.com",
                password: await hashPassword("!Password123"),
                name: "salma",
                gender: "FEMALE"
            },
        ],
        skipDuplicates: true
    })

    console.log("User Created")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })