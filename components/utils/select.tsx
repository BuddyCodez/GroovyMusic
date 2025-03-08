"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

type Props = {
    onChange: (value?: string) => void;
    onCreate?: (value: string) => void;
    options?: { label: string; value: string }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
}
export const Select = ({ onChange, onCreate, options = [], value, disabled, placeholder }: Props) => {
    const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
        onChange(option?.value);
    };
    const formattedValue = useMemo(() => {
        return options.find((o) => o.value === value);
    }, [options, value]);
    return (
        <CreateableSelect
            placeholder={placeholder}
            isDisabled={disabled}
            className="text-sm h-10"
            styles={{
                control: (base) => ({
                    ...base,
                    backgroundColor: "#0b0b0c",
                    borderColor: "#4a5568",
                    ":hover": {
                        backgroundColor: "#0b0b0c",

                    },
                    color: "#0b0b0c",
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: "#2d3748",
                    color: "#0b0b0c",
                }),
                singleValue: (base) => ({
                    ...base,
                    color: "#e2e8f0",
                }),
                placeholder: (base) => ({
                    ...base,
                    color: "#a0aec0",
                }),
            }}
            value={formattedValue}
            onChange={onSelect}
            options={options}
            onCreateOption={onCreate}
        />
    )
}