import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error, LabelAndSelect } from './styles';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<SelectProps> = ({
  name,
  label,
  icon: Icon,
  children,
  ...rest
}) => {
  const inputRef = useRef<HTMLSelectElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <>
      <LabelAndSelect>
        {label && <label htmlFor={name}>{label}</label>}
        <Container
          isErrored={!!error}
          isFilled={isFilled}
          isFocused={isFocused}
        >
          {Icon && <Icon size={20} />}
          <select
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            defaultValue={defaultValue}
            ref={inputRef}
            {...rest}
          >
            {children}
          </select>

          {error && (
            <Error title={error}>
              <FiAlertCircle color="#c53030" size={20} />
            </Error>
          )}
        </Container>
      </LabelAndSelect>
    </>
  );
};

export default Input;
