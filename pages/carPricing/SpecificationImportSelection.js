import React from "react";
import SharedTextArea from "../../components/shared/SharedTextArea";
import useLocalization from "@/config/hooks/useLocalization";

function SpecificationImportSelection({
  importedCarSpecification,
  setImportedCarSpecification,
}) {
  const { t } = useLocalization();

  return (
    <SharedTextArea
      value={importedCarSpecification}
      handleChange={(e) => {
        setImportedCarSpecification(e?.target?.value);
      }}
      placeholder={t.writeCarDescribtion}
      minRows={6}
      maxRows={8}
      hint={t.exampleForSpecify}
      showAstrick={true}
      label={t.describeAnother}
    />
  );
}

export default SpecificationImportSelection;
