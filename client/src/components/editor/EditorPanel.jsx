import { useDispatch, useSelector } from "react-redux";
import {
  addClientField,
  addCompanyField,
  deleteClientField,
  deleteCompanyField,
  selectCurrentQuotation,
  updateDisplaySettings,
  updateClientField,
  updateCompanyField,
  updateSectionTitles
} from "../../store/quotationSlice.js";
import { defaultDisplaySettings } from "../../utils/typography.js";
import { DetailsEditor } from "./DetailsEditor.jsx";
import { DraftsPanel } from "./DraftsPanel.jsx";
import { DynamicSectionsEditor } from "./DynamicSectionsEditor.jsx";
import { FooterEditor } from "./FooterEditor.jsx";
import { HeadingSectionEditor } from "./HeadingSectionEditor.jsx";
import { LogoSectionEditor } from "./LogoSectionEditor.jsx";
import { PricingTableEditor } from "./PricingTableEditor.jsx";

export const EditorPanel = () => {
  const dispatch = useDispatch();
  const quotation = useSelector(selectCurrentQuotation);
  const display = quotation.display || defaultDisplaySettings;

  return (
    <div className="editor-scrollbar flex h-[calc(100vh-88px)] flex-col gap-4 overflow-y-auto pr-2">
      <DraftsPanel />
      <LogoSectionEditor />
      <HeadingSectionEditor />
      <DetailsEditor
        title="Company Details Section"
        description="Default company fields are editable and extensible."
        fields={quotation.companyDetails}
        locked
        addAction={addCompanyField}
        updateAction={updateCompanyField}
        deleteAction={deleteCompanyField}
        sectionTitleColor={display.sectionTitleColor}
        sectionTitleSize={display.sectionTitleSize}
        onSectionTitleColorChange={(value) => dispatch(updateDisplaySettings({ sectionTitleColor: value }))}
        onSectionTitleSizeChange={(value) => dispatch(updateDisplaySettings({ sectionTitleSize: value }))}
        dividerColor={display.dividerColor}
        onDividerColorChange={(value) => dispatch(updateDisplaySettings({ dividerColor: value }))}
        sectionLabel={quotation.companyTitle}
        onSectionLabelChange={(value) => dispatch(updateSectionTitles({ companyTitle: value }))}
      />
      <DetailsEditor
        title="Client Details Section"
        description="Dedicated client area for billing and contact information."
        fields={quotation.clientDetails}
        showClientInformation={display.showClientInformation}
        onShowClientInformationChange={(value) => dispatch(updateDisplaySettings({ showClientInformation: value }))}
        addAction={addClientField}
        updateAction={updateClientField}
        deleteAction={deleteClientField}
        sectionLabel={quotation.clientTitle}
        onSectionLabelChange={(value) => dispatch(updateSectionTitles({ clientTitle: value }))}
      />
      <PricingTableEditor />
      <DynamicSectionsEditor />
      <FooterEditor />
    </div>
  );
};