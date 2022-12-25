import prisma from "../prisma";

type CaptainSubject = {
  id: number;
  name: string;
  about: string;
  parentId: number | null;
}

export const subjectDBHelper = {
  getRootLevelSubjects,
  createSubject,
  getSubjectChildren,
  deleteSubject,
  getSubject,
  getSubjectTopics,
  getSubjectBreadcrumbs,
  updateNameAbout,
  updateParent
}

function getSubjectChildren(id: number) {
  return prisma.subject.findMany({
    include: {
      children: {
        select: {
          id: true
        }
      },
    },
    where: {
      parentId: id
    }
  });
}

function getRootLevelSubjects() {
  return prisma.subject.findMany({
    include: {
      children: {
        select: {
          id: true
        }
      },
    },
    where: {
      parentId: null
    }
  });
}

function getSubjectTopics(id: number) {
  // Query to get all topics of subject
  return prisma.$queryRaw`
   SELECT id, title, about from public."Topic" WHERE "subjectId" = ${id};
 `
}

function getSubjectBreadcrumbs(id: number){
  return prisma.$queryRaw`
    WITH RECURSIVE ancestors AS (
      SELECT
        id,
        "parentId",
        name
      FROM 
        public."Subject"
      WHERE 
        id = ${id}
      UNION 
        SELECT 
          s.id,
          s."parentId",
          s.name
        FROM 
         public."Subject" s
        INNER JOIN ancestors a ON a."parentId" = s.id
    ) SELECT * from ancestors;
  `
}

// Get subject details (with array of topics (id, title, about), and breadcrumbs)
function getSubject(id: number) {
  // Query for subject detail with breadcrumbs and topics
  return prisma.$queryRaw`
    WITH RECURSIVE ancestors AS (
      SELECT
        id,
        "parentId",
        name
      FROM 
        public."Subject"
      WHERE 
        id = ${id}
      UNION 
        SELECT 
          s.id,
          s."parentId",
          s.name
        FROM 
         public."Subject" s
        INNER JOIN ancestors a ON a."parentId" = s.id
    ) SELECT *, array(select json_build_object('id',id,'title',title,'about',about) from public."Topic" WHERE "subjectId" = ${id}) as topics, array(select json_build_object('id',id,'name',name) from ancestors) as breadcrumbs FROM public."Subject" s WHERE s.id= ${id};
  `

  // // Working query for subject detail with breadcrumbs only
  // return prisma.$queryRaw`
  //   WITH RECURSIVE ancestors AS (
  //     SELECT
  //       id,
  //       "parentId",
  //       name
  //     FROM 
  //       public."Subject"
  //     WHERE 
  //       id = ${id}
  //     UNION 
  //       SELECT 
  //         s.id,
  //         s."parentId",
  //         s.name
  //       FROM 
  //        public."Subject" s
  //       INNER JOIN ancestors a ON a."parentId" = s.id
  //   ) SELECT *, array(select json_build_object('id',id,'name',name) from ancestors) as breadcrumbs FROM public."Subject" s WHERE s.id= ${id};
  // `

  // subject detail with children only
  // return prisma.subject.findUniqueOrThrow({
  //   where: {
  //     id: id,
  //   },
  //   include: {
  //     children: {
  //       select: {
  //         id: true
  //       }
  //     },
  //   }
  // });

  // Original query that returns only the breadcrumbs - no subject detail
  // return prisma.$queryRaw`
  //     WITH RECURSIVE ancestors AS (
  //       SELECT
  //         id,
  //         "parentId",
  //         name
  //       FROM 
  //         public."Subject"
  //       WHERE 
  //         id = 2
  //       UNION 
  //         SELECT 
  //           s.id,
  //           s."parentId",
  //           s.name
  //         FROM 
  //          public."Subject" s
  //         INNER JOIN ancestors a ON a."parentId" = s.id
  //     ) SELECT * FROM ancestors;
  //   `

  // // All Subjects including their breadcrumbs (heavy query)
  //   return prisma.$queryRaw`
  //   WITH RECURSIVE alldescendants AS (
  //     SELECT id, name, ARRAY[json_build_object('id', id, 'name', name)] AS breadcrumbs
  //     FROM public."Subject"
  //     WHERE "parentId" IS NULL
  //     UNION ALL
  //       SELECT 
  //         e.id,
  //         e.name,
  //         (
  //           b1.breadcrumbs || ARRAY[json_build_object('id', e.id, 'name', e.name)]
  //         ) AS breadcrumbs
  //       FROM
  //           public."Subject" e
  //       INNER JOIN alldescendants b1 ON e."parentId" = b1.id
  //   ) SELECT 
  //           *
  //     FROM alldescendants
  //     ORDER BY
  //           id;
  // `
}


function updateNameAbout(id: number, name: string, about: string) {
  return prisma.subject.update({
    where: {
      id: id
    },
    data: {
      name: name,
      about: about,
    },
  })
}

function updateParent(id: number, parentId: number) {
  return prisma.subject.update({
    where: {
      id: id
    },
    data: {
      parentId: parentId,
    },
  })
}

function createSubject({ name = "", parentId = null }: CaptainSubject) {
  return prisma.subject.create({
    data: {
      name: name,
      parentId: parentId,
    },
  })
}

async function deleteSubject(id: number, parentId: number) {
  // Move all its children to parent subject
  console.log("Setting children subjects' and topics' parentId to " + parentId);
  const updateChildren = await prisma.subject.updateMany({
    where: {
      parentId: id,
    },
    data: {
      parentId: parentId,
    },
  })
  console.log("moving children to parent, result:", JSON.stringify(updateChildren));
  // Move all its topics to parent subject
  const moveTopics = await prisma.topic.updateMany({
    where: {
      subjectId: id,
    },
    data: {
      subjectId: parentId,
    },
  })
  console.log("moving topics to parent subject, result:", JSON.stringify(moveTopics));
  // Now delete this subject
  const deletedSubject = await prisma.subject.delete({
    where: {
      id: id,
    },
  })
  console.log("deleted subject, result:", JSON.stringify(deletedSubject));
  return deletedSubject;
}