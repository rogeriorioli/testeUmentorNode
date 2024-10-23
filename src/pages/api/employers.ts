// pages/api/employers.ts

import { prisma } from '@/helpers/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface EmployerRequestBody {
  email: string;
  nome: string;
  situacao: string;
  data_admissao: string;
}

interface CustomError extends Error {
  code?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, nome, situacao, data_admissao }: EmployerRequestBody = req.body;

    if (!email || !nome || !situacao || !data_admissao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
      const employer = await prisma.employer.create({
        data: {
          email,
          nome,
          situacao,
          data_admissao,
        },
      });

      return res.status(201).json(employer);
    } catch (error) {
      const customError = error as CustomError;

      if (customError.code === 'P2002') {
        return res.status(409).json({ error: 'Email já existe.' });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else if (req.method === 'GET') {
    try {
      const employers = await prisma.employer.findMany();
      return res.status(200).json(employers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
