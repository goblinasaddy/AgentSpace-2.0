import { z } from "zod";
import { prisma } from "@/infrastructure/database/client";
import { hashPassword, verifyPassword } from "./password";
import { signToken } from "./jwt";

export const RegisterUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().optional(),
});

export const LoginUserSchema = z.object({
  login: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;

export async function registerUser(input: RegisterUserInput) {
  const validated = RegisterUserSchema.parse(input);

  const existingEmail = await prisma.user.findUnique({
    where: { email: validated.email.toLowerCase() },
  });
  if (existingEmail) {
    throw new Error("A user with this email already exists.");
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username: validated.username.toLowerCase() },
  });
  if (existingUsername) {
    throw new Error("Username is already taken.");
  }

  const passwordHash = await hashPassword(validated.password);

  const user = await prisma.user.create({
    data: {
      username: validated.username.toLowerCase(),
      email: validated.email.toLowerCase(),
      displayName: validated.displayName || validated.username,
      passwordHash,
    },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      website: true,
      createdAt: true,
    },
  });

  return user;
}

export async function authenticateUser(input: LoginUserInput) {
  const validated = LoginUserSchema.parse(input);

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: validated.login.toLowerCase() },
        { username: validated.login.toLowerCase() },
      ],
    },
  });

  if (!user) {
    throw new Error("Invalid username/email or password.");
  }

  const isValid = await verifyPassword(validated.password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid username/email or password.");
  }

  const { passwordHash: _, ...safeUser } = user;
  const token = signToken({ userId: user.id, username: user.username });
  return { user: safeUser, token };
}
