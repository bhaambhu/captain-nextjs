import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import dimensions from "../../config/dimensions";
import SectionHeader from "../../components/Texts/SectionHeader";
import colors from "../../config/colors";
import dataInfoAPIService from "../../lib/APIServices/dataInfoAPIService";
import LoadingIndicator from "../../components/LoadingIndicator";

let dataGroups = {
  knowledge: [],
  users: [],
  auth: [],
  token: [],
  django: [],
  others: []
}

function DataInfoViewer() {
  const [dataInfo, setDataInfo] = useState(null);

  const loadDataInfo = async () => {
    console.log("fetching data stats...");
    // await new Promise((r) => setTimeout(r, 2000));
    const result = await dataInfoAPIService.getDataInfo();
    if (!result.ok) return "Error: " + result.problem;
    console.log(result.data);
    result.data.forEach(item => {
      if (item[0].startsWith("knowledge")) {
        dataGroups.knowledge.push(item);
      } else if (item[0].startsWith("django")) {
        dataGroups.django.push(item);
      } else if (item[0].startsWith("users")) {
        dataGroups.users.push(item);
      } else if (item[0].startsWith("auth")) {
        dataGroups.auth.push(item);
      } else if (item[0].startsWith("token")) {
        dataGroups.token.push(item);
      } else {
        dataGroups.others.push(item);
      }
    })
    console.log(dataGroups)
    setDataInfo(dataGroups);
    return result.data;
  };

  useEffect(() => {
    loadDataInfo();
  }, []);

  if (!dataInfo) {
    return <LoadingIndicator visible={true} />
  }
  return (
    <div className="p-3 gap-3 flex flex-wrap">
      {
        Object.entries(dataInfo).map(entry => {
          return (
            <div key={entry[0]}>
              <SectionHeader>
                {entry[0]}
              </SectionHeader>
              <table style={{}}>
                {entry[1].map((item) => {
                  return (
                    <tr key={item[0]}>
                      <td className="p-2 border bg-cclrs-bg-surface border-cclrs-dark-strong" >{item[0].replace(entry[0] + '_', '').replaceAll('_', ' ')}</td>
                      <td className="p-2 border bg-cclrs-bg-surface border-cclrs-dark-strong">{item[1]}</td>
                    </tr>
                  );
                })}
              </table>
            </div>)

        })
      }

    </div>
  );
}

export default function Data() {
  return (
    <DataInfoViewer />
  );
}
