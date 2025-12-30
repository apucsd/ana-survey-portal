import { InfoContentType } from '@prisma/client';
import { prisma } from '../../utils/prisma';
import { InfoContent } from './info-content.interface';

const createInfoContentInDB = async (infoContent: InfoContent) => {
    const result = await prisma.infoContent.upsert({
        where: {
            type: infoContent.type,
        },
        update: {
            title: infoContent.title,
            content: infoContent.content,
        },
        create: infoContent,
    });
    return result;
};

const getAllInfoContentFromDB = async (type: InfoContentType) => {
    const result = await prisma.infoContent.findMany({
        where: {
            type: type ?? undefined,
        },
    });
    return result;
};

export const InfoContentService = {
    createInfoContentInDB,
    getAllInfoContentFromDB,
};
