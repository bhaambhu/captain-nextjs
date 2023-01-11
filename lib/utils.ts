import prisma from "./prisma";

function breadString(breadcrumbs, includeSelf = false) {
  let iterateUpto = includeSelf ? breadcrumbs.length : breadcrumbs.length - 1;
  var theString = "";
  for (let i = 1; i < iterateUpto; i++) {
    theString = theString + breadcrumbs[i].name + " ";
    if (i < breadcrumbs.length - 1) theString = theString + " > ";
  }
  // // For reversed breadcrumb string
  // for (let i = breadcrumbs.length - 1; i >= iterateUpto; i--) {
  //   theString = theString + breadcrumbs[i].name + " ";
  //   if (i > 0) theString = theString + " > ";
  // }
  return theString;
}

function truncateString(str, n){
  return (str?.length > n) ? str.slice(0, n-1) + '...' : str;
};

function viewableDateTime(input) {
  return new Date(input).toLocaleString([], {day:"numeric", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit", hour12: true});
}

function confirmation(message){
  let confirmation = window.confirm(message);
  return confirmation;
}

// It modifies the API received subjects data so that it can be used by atlaskit/tree library, by
// 1) Converting children from JSONArray to simple array of IDS
// 2) Add fields hasChildren:?, isExpanded:false, isChildrenLoading:false
function makeSubjectAPIDataReadyForAtlaskit(apiReceivedSubjectData) {
  return apiReceivedSubjectData;
  return apiReceivedSubjectData.map(item => {
    var childrenArray = [];
    item.children.forEach(childItem => {
      childrenArray.push(childItem.id)
    })
    return { ...item, children: childrenArray, hasChildren: (item.children.length > 0), isExpanded: false, isChildrenLoading: false };
  })
}

// function getAllTableNames() {
//   return prisma.$queryRaw`
//     SELECT table_name
//     FROM information_schema.tables
//     WHERE table_schema='public'
//     AND table_type='BASE TABLE';
//   `
// }

export { breadString, makeSubjectAPIDataReadyForAtlaskit, viewableDateTime, confirmation, truncateString };