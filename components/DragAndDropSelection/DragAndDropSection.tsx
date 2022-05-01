import React, { ChangeEvent, useState } from "react";
import * as xlsx from "xlsx";
import { Button, Input } from "..";
import styles from "./DragAndDropSection.module.scss";
import { CloudUploadIcon, DocumentTextIcon } from "@heroicons/react/outline";

const DragAndDropSection = () => {
  const acceptedFileTypes = ["xlsx", "xls", "csv"];
  const [studentFileDisplayName, setStudentFileDisplayName] = useState<
    string | null
  >(null);
  const [dropAreaIcon, setDropAreaIcon] = useState(
    <DocumentTextIcon className="h-12 mb-3 text-slate-500" />
  );
  const [fileTypeAlert, setFileTypeAlert] = useState(false);
  const [numGroups, setNumGroups] = useState(1);

  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?e.target.files[0]:null;
    if (file) {
      const fileName = file.name;
      const fileType = fileName.split(".").pop();
      if(!fileType)
        return;
      if (acceptedFileTypes.includes(fileType)) {
        setStudentFileDisplayName(fileName);
        setFileTypeAlert(false);
        readFile(file);
      } else {
        setFileTypeAlert(true);
      }
    }
  };

  const drag = () => {
    setDropAreaIcon(<CloudUploadIcon className="h-12 mb-3 text-slate-500" />);
  };

  const leave = () => {
    setDropAreaIcon(<DocumentTextIcon className="h-12 mb-3 text-slate-500" />);
  };

  const splitIntoGroups = () => {
    // TODO:Grouping logic here
  }

  const readFile = (file: File) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = () => {
        const bufferArray = fileReader.result as ArrayBuffer;

        const workbook = xlsx.read(bufferArray, { type: "array" });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = xlsx.utils.sheet_to_csv(ws);
        resolve(data);

        const dataArray = data.split(",");
        return dataArray;
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <>
      {/* Drag and drop area */}
      <div className={styles.dropSectionInner}>
        <p className="text-slate-700 text-base mb-2 font-semibold">
          Drop your spread sheet here, or browse
        </p>
        {dropAreaIcon}
        <p className="text-slate-400 text-s">
          {studentFileDisplayName
            ? studentFileDisplayName
            : "Supports CSV, XLS, XLSX"}
        </p>
        <input
          onDragOver={drag}
          onDragLeave={leave}
          onDrop={leave}
          type="file"
          className={styles.dropSectionWidth}
          onChange={uploadFile}
        />
      </div>
      {fileTypeAlert ? (
        <div
          className="my-4 bg-red-50 border border-red-300 text-red-700 px-10 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">
            Please upload a file ending in <b>.xlsx , .xls or .csv</b>
          </span>
        </div>
      ) : null}
      <div className="my-4 w-full md:w-1/3 gap-4 flex flex-col md:flex-row justify-center">
        {/* Drop Down */}
        <Input type="number" value={numGroups} onChange={(e) => setNumGroups(e.target.value)} min={1} placeHolder="Group into" padding="px-3 py-2" />
        {/* Generate Button */}
        <Button onClick={splitIntoGroups} value="Generate" width="w-full md:w-1/3" padding="px-3 py-2" />
      </div>
    </>
  );
};

export default DragAndDropSection;
