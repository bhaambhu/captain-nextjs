import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import dimensions from "../../config/dimensions";
import SanEDDButton from "../../components/Buttons/SanEDDButton";
import topicsAPIService from "../../lib/APIServices/topicsAPIService";
import SectionHeader from "../../components/Texts/SectionHeader";
import APIEndpoints from "../../config/APIEndpoints";

export default function Topics() {
  const [orphanTopics, setOrphanTopics] = useState(null);

  const loadOrphanTopics = async () => {
    console.log("fetching orphan topics...");
    // await new Promise((r) => setTimeout(r, 2000));
    const result = await topicsAPIService.getOrphanTopics();
    if (!result.ok) return "Error: " + result.problem;
    console.log(result.data);
    setOrphanTopics(result.data);
    return result.data;
  };

  useEffect(() => {
    loadOrphanTopics();
  }, []);
  if (orphanTopics) {
    return (
      <div
        style={{
          padding: dimensions.contentDistance,
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          gap: dimensions.contentDistance,
        }}
      >
        <SectionHeader>
          Topics that don&apos;t have any subject assigned:
        </SectionHeader>
        {orphanTopics.map((item) => {
          return (
            <SanEDDButton
              key={item.id}
              to={APIEndpoints.TOPICS + item.id}
              style={{ width: 200 }}
              title={item.title}
              overline={item.about}
            />
          );
        })}
      </div>
    );
  } else {
    return (
      <div>
        <Modal />
      </div>
    );
  }
}
