import { ComponentProps, ReactElement, cloneElement, Children } from 'react'

interface FieldProps extends ComponentProps<'div'> {
  name: string
  children: ReactElement | ReactElement[]
}

export function Field({ name, children, ...props }: FieldProps) {
  return (
    <div data-name={name} data-is-field {...props}>
      {Array.isArray(children) ? (
        <>
          {Children.map(children, (child) => {
            return cloneElement(
              child,
              { ...child.props, name },
              child.props.children,
            )
          })}
        </>
      ) : (
        <>
          {cloneElement(
            children,
            { ...children.props, name },
            children.props.children,
          )}
        </>
      )}
    </div>
  )
}
