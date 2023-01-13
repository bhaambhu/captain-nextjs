import MarkdownPreview from "../components/Markdown/MarkdownPreview";
import twColors from "../config/twColors";
import useAuth from "../lib/auth/useAuth"

export default function Home() {
  const auth = useAuth();

  let pageContent = publicPage;

  if (auth.isAuthenticated()) {
    if (auth.isSuperUser()) {
      pageContent = superuserPage;
    } else if (auth.isStaff()) {
      pageContent = staffPage;
    } else {
      pageContent = authenticatedPage;
    }
    pageContent = `# Hello ${auth.user.display_name}!` + pageContent
  }
  return (
    // Whole Page
    <div className="p-3">
      {/* Surface */}
      <div className={twColors.surfaceSimple + ' border rounded shadow-2xl p-5 cursor-default prose prose-p:text-justify dark:prose-invert'}>
        <MarkdownPreview>{pageContent}</MarkdownPreview>
      </div>
    </div>
  )
}

const superuserPage = `
Welcome to *Captain*, the ***C*omputer *A*ssisted *P*ersonal *T*utor with *A*daptive *In*struction**. Since you are a *Super User*, you know the drill!
`

const authenticatedPage = `
Welcome to *Captain*, the ***C*omputer *A*ssisted *P*ersonal *T*utor with *A*daptive *In*struction**. Since you are a *registered user*, feel free to download the *mobile app* (coming soon) to select a path and start your learning journey. Here's an introduction to the terminology used in this system:

## Paths
&ensp;A *path*  is a learning journey a student embarks on. It is basically a sequence of topics, that when completed, helps prepare a student for some particular goal. Paths can be for preparation of a particular job, learning a skill, or simply learning a broader subject. **In the mobile app you can select a path and the app will help you progress through it by spending just a few minutes everyday.**

## Topics
&ensp;*Topics* are small learnable units in the system. Topics will also specify other topics you need to read in order to be ready for reading a particular topic. **In the mobile app you can explore, read and collect topics from various subjects.**

## Subjects
&ensp;*Subjects* are basically like folders that contain topics and other subjects. Subjects exist to facilitate the upcoming features that deal with *questions* . Since a subject is a group of somewhere-related topics, if the system is unable to assign a user-submitted question to a particular topic, it can assign it to one or more subjects, which can then be dealt by the staff that deals with the topics in that subject, or related students who have studied any of the topics from that subject.

For any queries feel free to contact the *administration*.
`

const publicPage = `
# Hello there!
Welcome to *Captain*, the ***C*omputer *A*ssisted *P*ersonal *T*utor with *A*daptive *In*struction**. If you are a student, feel free to create a free account through the **Register** button and download the *mobile app* (coming soon) to select a path and start your learning journey. Here's an introduction to the terminology used in this system:

## Paths
&ensp;A *path*  is a learning journey a student embarks on. It is basically a sequence of topics, that when completed, helps prepare a student for some particular goal. Paths can be for preparation of a particular job, learning a skill, or simply learning a broader subject. **In the mobile app you can select a path and the app will help you progress through it by spending just a few minutes everyday.**

## Topics
&ensp;*Topics* are small learnable units in the system. Topics will also specify other topics you need to read in order to be ready for reading a particular topic. **In the mobile app you can explore, read and collect topics from various subjects.**

## Subjects
&ensp;*Subjects* are basically like folders that contain topics and other subjects. Subjects exist to facilitate the upcoming features that deal with *questions* . Since a subject is a group of somewhere-related topics, if the system is unable to assign a user-submitted question to a particular topic, it can assign it to one or more subjects, which can then be dealt by the staff that deals with the topics in that subject, or related students who have studied any of the topics from that subject.

For any queries feel free to contact the *administration*.
`

const staffPage = `
Welcome to *Captain*, the ***C*omputer *A*ssisted *P*ersonal *T*utor with *A*daptive *In*struction**. Since you are a *staff member*, you have the following capabilites:
## Manage Paths

&ensp;A *path*  is a learning journey a student embarks on. It is basically a sequence of topics, that when completed, helps prepare a student for some particular goal. Paths can be for preparation of a particular job, learning a skill, or simply learning a broader subject. **A staff member is allowed to create paths and fully manage the paths they have created.**

## Manage Topics

&ensp;A *topic*  is the smallest learnable unit in the system. It is a sequence of *steps* , the step could be a theory step - for introducing the student to some theory, which in-turn is divided into *sections*  for studying in sequence, one-at-a-time on a mobile device. Other types of steps that can be added in a topic are a question step, more types of steps coming soon. **A staff member is allowed to create and manage the topics they have created.**

**Note:** Topics should be crafted as re-usable units. They should be small enough so that they can be re-used inside multiple study paths. A topic can be small enough thanks to the concept of *topic requirements*, wherein a topic A can address that it requires the knowledge of topics B, C, ... any number of other topics before one can study topic A. The system prevents *requirement-loops* automatically.

## Manage Subjects

&ensp;*Subjects*  are basically like folders that contain topics and other subjects. They are a tree-based structure used for grouping and organizing topics. Subjects exist to facilitate the upcoming features that deal with *questions*. Since a subject is a group of somewhere-related topics, if the system is unable to assign a user-submitted question to a particular topic, it can assign it to one or more subjects, which can then be dealt by the staff that deals with the topics in that subject, or related students who have studied any of the topics from that subject. **A staff member is allowed to create, manage and delete subjects.**

## Data View

&ensp;The *Data* page is only for debugging purposes for now, and it shows the current state of the backend database to the staff and the admins.

For any queries feel free to contact the *administration*.
`