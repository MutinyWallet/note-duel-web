import {
  createForm,
  required,
  setValue,
  SubmitHandler,
} from "@modular-forms/solid";
import { createSignal, Show } from "solid-js";

import { Button, VStack } from "~/components";
import { InfoBox } from "~/components/InfoBox";
import { TextField } from "~/components/TextField";
import { Checkbox } from "~/components/CheckBox";
import { useMegaStore } from "~/state/megaStore";

type ImportNsecForm = {
  nsec: string;
  save: boolean;
};

export function ImportNsec() {
  const [_, actions] = useMegaStore();

  const [error, setError] = createSignal<string>();

  const [importForm, { Form, Field }] = createForm<ImportNsecForm>({
    initialValues: {
      nsec: "",
      save: false,
    },
  });

  const handleSubmit: SubmitHandler<ImportNsecForm> = async (
    f: ImportNsecForm,
  ) => {
    try {
      actions.setup(f.nsec);
      if (f.save) {
        localStorage.setItem("nsec", f.nsec);
      }
    } catch (e) {
      setError("Invalid nsec");
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <VStack>
          <Field name="nsec" validate={[required("Nsec is required")]}>
            {(field, props) => (
              <TextField
                {...props}
                {...field}
                value={field.value}
                error={field.error}
                label="Your nsec"
              />
            )}
          </Field>
          <Field name="save" type="boolean">
            {(field, _fieldProps) => (
              <Checkbox
                checked={field.value || false}
                label="Save for future"
                onChange={(c) => setValue(importForm, "save", c)}
              />
            )}
          </Field>
          <Show when={error()}>
            <InfoBox accent="red">{error()}</InfoBox>
          </Show>
          <Button
            loading={importForm.submitting}
            disabled={
              !importForm.dirty || importForm.submitting || importForm.invalid
            }
            intent="blue"
            type="submit"
          >
            Import
          </Button>
        </VStack>
      </Form>
    </>
  );
}
