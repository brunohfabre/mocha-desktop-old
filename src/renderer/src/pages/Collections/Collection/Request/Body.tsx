import { useFormContext, useController } from 'react-hook-form'

import { json } from '@codemirror/lang-json'
import { Editor } from '@monaco-editor/react'
import { CaretDown } from '@phosphor-icons/react'
import CodeMirror from '@uiw/react-codemirror'

import { Button } from '../../../../components/Button'
import { Dropdown } from '../../../../components/Dropdown'
import { Tabs } from '../../../../components/Tabs'

export function Body() {
  const { control } = useFormContext()
  const { field: editorField } = useController({
    name: 'body',
    control,
  })
  const { field: typeField } = useController({
    name: 'bodyType',
    control,
  })

  function handleEditorDidMount(editor: any) {
    window.addEventListener('resize', () => {
      editor.layout({
        width: 'auto',
        height: 'auto',
      })
    })
  }

  return (
    <Tabs.Content value="body">
      <div className="flex-1 flex flex-col relative">
        {typeField.value === 'JSON' && (
          <CodeMirror
            value="console.log('hello world!');"
            extensions={[json()]}
            onChange={console.log}
            className="flex-1 flex overflow-auto"
          />
          // <Editor
          //   defaultLanguage="json"
          //   options={{
          //     detectIndentation: false,
          //     tabSize: 2,
          //     scrollBeyondLastLine: false,
          //     minimap: {
          //       enabled: false,
          //     },
          //   }}
          //   onMount={handleEditorDidMount}
          //   value={editorField.value}
          //   onChange={editorField.onChange}
          // />
        )}

        <div className="absolute bottom-4 right-[30px]">
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button type="button">
                {typeField.value} <CaretDown className="ml-2" />
              </Button>
            </Dropdown.Trigger>

            <Dropdown.Content align="end">
              <Dropdown.Item onClick={() => typeField.onChange('NONE')}>
                NONE
              </Dropdown.Item>
              <Dropdown.Item onClick={() => typeField.onChange('JSON')}>
                JSON
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      </div>
    </Tabs.Content>
  )
}
