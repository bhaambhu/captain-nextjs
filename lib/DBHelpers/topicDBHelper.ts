import prisma from "../prisma";
import { subjectDBHelper } from "./subjectDBHelper";

export const topicDBHelper = {
  getAllTopics,
  getOrphanTopics,
  getTopic,
  getTopicWithData,
  // saveTopicDetail,
  createTopic,
  deleteTopic,
  getRequirementsArray,
  addRequirement,
  removeRequirement,
  willMakeCycle,
  updateTopicSubject,
}

async function willMakeCycle(cTopicId: number, rTopicId: number) {
  if (cTopicId == rTopicId) return true;
  else {
    // It will make a cycle if the required topic somewhere down the line requires the current topic also.
    let reqsArrayOfRTopic = await getRequirementsArray(rTopicId);
    reqsArrayOfRTopic = reqsArrayOfRTopic[0].requires;
    if (reqsArrayOfRTopic) {
      for (const reqId of reqsArrayOfRTopic) {
        let miniResult = await willMakeCycle(cTopicId, reqId);
        if (miniResult) {
          return true;
        }
      }
    }
    return false;
  }
}

function removeRequirement(cTopicId: number, rTopicId: number) {
  return prisma.$executeRaw`
      DELETE FROM public."TopicRequirements" WHERE "requiredById" = ${cTopicId} AND "requiresId" = ${rTopicId};
    `
}

async function addRequirement(cTopicId: number, rTopicId: number) {
  const makesCycle = await willMakeCycle(cTopicId, rTopicId);
  if (makesCycle) {
    throw new Error("Cannot add this topic as a requirement as it will result in a requirement cycle.");
  } else {
    return prisma.$executeRaw`
      INSERT INTO public."TopicRequirements" ("requiredById", "requiresId") VALUES(${cTopicId}, ${rTopicId}) ON CONFLICT DO NOTHING;
    `
  }
}

async function deleteTopic(id: number) {
  let newRequirementsInserted = null;
  // Move all its requirements to the requiredBy topics
  // First get all its requirements
  let reqsArray = await getRequirementsArray(id);
  reqsArray = reqsArray[0].requires;
  // Proceed only if there is any requirements
  if (reqsArray) {
    // Get all topics this topic is required by
    let reqsByArray = await getRequiredBysArray(id);
    reqsByArray = reqsByArray[0]["requiredBy"];
    // Proceed only if there are some topics that require this topic
    if (reqsByArray) {
       newRequirementsInserted = await prisma.$queryRaw`
        INSERT INTO public."TopicRequirements" ("requiredById", "requiresId")
        SELECT unnest(${reqsByArray}),x
        FROM  	unnest(${reqsArray}) x
        ON CONFLICT DO NOTHING;
      `
    } else {
      // return `Topic ${id} had requirements ${String(reqsArray)}, but no topic required Topic ${id} so requirement transfer not necessary.`;
    }
  } else {
    // return `Topic ${id} had no required topics, so requirement transfer not necessary.`;
  }

  // Delete the actual topic
  await prisma.topic.delete({
    where: {
      id:id,
    }
  })
  return newRequirementsInserted;
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

function getOrphanTopics() {
  return prisma.topic.findMany({
    where: {
      subjectId: null,
    }
  })
}

function getAllTopics() {
  return prisma.topic.findMany();
}

function getRequiredBysArray(id: number) {
  return prisma.$queryRaw`
    SELECT array_agg("requiredById") as "requiredBy" from public."TopicRequirements" where "requiresId" = ${id}
  `
}

function getRequirementsArray(id: number) {
  return prisma.$queryRaw`
    Select array_agg("requiresId") as requires from public."TopicRequirements" where "requiredById" = ${id}
  `
}

function getTopicWithData(id: number) {
  return prisma.topic.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      requires: {
        select: {
          requires: true
        }
      },
      paths: true,
    }
  })
}

// Get subject details (with array of topics (id, title, about), and breadcrumbs)
// Update this to get Topic Detail: id,title,about,requirements array, subject id, breadcrumbs, assessor, and steps.
async function getTopic(id: number) {
  // Query for subject detail with breadcrumbs and topics
  let topicData = await prisma.$queryRaw`
    SELECT *, array(select json_build_object('id',id,'title',title,'about',about) from public."TopicRequirements" WHERE "requiredById" = ${id}) as requires FROM public."Topic" WHERE id= ${id};
  `
  topicData = topicData[0];
  let breadcrumbs = await subjectDBHelper.getSubjectBreadcrumbs(topicData.subjectId)
  topicData = {...topicData, breadcrumbs:breadcrumbs}
  return topicData;
// return prisma.$queryRaw`
    // WITH RECURSIVE ancestors AS (
    //   SELECT
    //     id,
    //     "parentId",
    //     name
    //   FROM 
    //     public."Subject"
    //   WHERE 
    //     id = ${id}
    //   UNION 
    //     SELECT 
    //       s.id,
    //       s."parentId",
    //       s.name
    //     FROM 
    //      public."Subject" s
    //     INNER JOIN ancestors a ON a."parentId" = s.id
    // ) SELECT *, array(select json_build_object('id',id,'title',title,'about',about) from public."Topic" WHERE "subjectId" = ${id}) as topics, array(select json_build_object('id',id,'name',name) from ancestors) as breadcrumbs FROM public."Subject" s WHERE s.id= ${id};
//   `

// ) SELECT *, array(select json_build_object('id',id,'title',title,'about',about) from public."Topic" WHERE "subjectId" = ${id}) as topics, array(select json_build_object('id',id,'name',name) from ancestors) as breadcrumbs FROM public."Subject" s WHERE s.id= ${id};
  // `


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

function updateTopicSubject(id: number, subjectId: number) {
  return prisma.topic.update({
    where: {
      id: id
    },
    data: {
      subjectId: subjectId,
    },
  })
}

function createTopic({ title = "", subjectId = null }) {
  return prisma.topic.create({
    data: {
      title: title,
      subjectId: subjectId,
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