import "reflect-metadata";
import bcrypt from "bcrypt";
import { AppDataSource } from "../database/data-source";
import { User } from "../../modules/user/schema/User.schema";

async function seedAdmin() {
  // Verifica se a senha do admin foi fornecida via variável de ambiente
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("❌ ADMIN_PASSWORD não definida. Use: ADMIN_PASSWORD=senha_forte npm run seed:admin");
    process.exit(1);
  }

  await AppDataSource.initialize();

  const repo = AppDataSource.getRepository(User);

  const adminExistente = await repo.findOne({
    where: { email: "admin@email.com" },
  });

  if (adminExistente) {
    console.log("Admin já existe.");
    await AppDataSource.destroy();
    return;
  }

  // Usa o mesmo número de rounds do service (12)
  const senhaHash = await bcrypt.hash(adminPassword, 12);

  const admin = repo.create({
    email: "admin@email.com",
    password_hash: senhaHash,
    role: "admin",
    adminProfile: {
      full_name: "Administrador",
      department: "Admin",
    },
  });

  await repo.save(admin);
  console.log("Administrador criado com sucesso!");
  await AppDataSource.destroy();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Erro ao executar seed:", err);
  process.exit(1);
});