import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getAllSolutions = async () => {
    try {
        return await prisma.solution.findMany({
            orderBy: {
                date: 'desc',
            },
        });
    } catch (error) {
        throw error;
    }
};
export const createSolution = async ({
    projectName,
    description,
    linkVideoPreview,
    date,
    linkPresentSheet,
    type,
    tag, }: {
        projectName: string;
        description: string;
        linkVideoPreview: string;
        date: string;
        linkPresentSheet: string;
        type: string;
        tag: string;
    }) => {
    try {
        return await prisma.solution.create({
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
    } catch (error) {
        throw error;
    }
};
