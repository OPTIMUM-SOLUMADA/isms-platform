import { FC, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Props {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
}

const RTERichText: FC<Props> = ({
    label,
    value = "",
    onChange,
    placeholder = "Write something...",
    readOnly = false,
}) => {
    const [editorValue, setEditorValue] = useState(value);

    // Sync external changes
    useEffect(() => {
        setEditorValue(value);
    }, [value]);

    // Handle editor input
    const handleChange = (content: string) => {
        setEditorValue(content);
        onChange?.(content);
    };

    // Toolbar configuration (similar to react-rte)
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }], // Heading dropdown
            ["bold", "italic", "underline"], // Inline styles
            [{ list: "ordered" }, { list: "bullet" }], // Lists
            ["blockquote", "link"], // Quote + link
            ["clean"], // Remove formatting
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "blockquote",
        "link",
    ];

    return (
        <div className="flex flex-col space-y-2">
            {label && <label className="font-medium text-gray-700">{label}</label>}

            <div className="focus-within:ring-2 focus-within:ring-theme-2/20">
                <ReactQuill
                    theme="snow"
                    value={editorValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    modules={modules}
                    formats={formats}
                    className="text-gray-800 text-editor"
                />
            </div>
        </div>
    );
};

export default RTERichText;
