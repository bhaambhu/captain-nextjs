import prisma from "../prisma";

type CaptainPath = {
  id: number;
  title: string;
  about: string;
  published: boolean;
}

export const pathDBHelper = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
}

function getAll() {
  return prisma.path.findMany();
}

function getById(id: number) {
  return prisma.path.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      topics: {
        select: {
          order: true,
          topic: true,
        },
      }
    }
  });
}

function create({ title = "", about = "", published = false }: CaptainPath) {
  return prisma.path.create({
    data: {
      title: title,
      about: about,
      published: published,
    },
  })
}

function update() {

}

function _delete(id:number) {
  return prisma.path.delete({
    where: {
      id: id
    }
  })
}