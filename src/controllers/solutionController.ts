import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllSolutions = async (req: Request, res: Response) => {
  try {
    const solutions = await prisma.solution.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    res.json(solutions);
  } catch (error) {
    handleError(res, error);
  }
};
export const createSolution = async (req: Request, res: Response) => {
  const { projectName, description, linkVideoPreview, date, linkPresentSheet, type, tag } = req.body;
  try {
    const newSolution = await prisma.solution.create({
      data: {
        projectName,
        description,
        linkVideoPreview,
        date: new Date(date),
        linkPresentSheet,
        type,
        tag,
      },
    });
    res.status(200).json(newSolution);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateSolution = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updated = await prisma.solution.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error('อัปเดตไม่สำเร็จ:', error);
    res.status(500).json({ error: 'ไม่สามารถอัปเดตโปรเจกต์ได้' });
  }
};



export const deleteSolution = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.solution.delete({
      where: { id },
    });
    res.status(204).send(); // ลบสำเร็จ ไม่ต้องส่ง body
  } catch (error) {
    console.error('ลบโปรเจกต์ไม่สำเร็จ:', error);
    res.status(500).json({ error: 'ไม่สามารถลบโปรเจกต์ได้' });
  }
};

export const getSolutionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const sol = await prisma.solution.findUnique({ where: { id } })
    if (!sol) { res.status(404).json({ message: 'Not found' }); return }
    res.json(sol)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}



// Helper function to handle errors
const handleError = (res: Response, error: any) => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Unknown error' });
  }
};
