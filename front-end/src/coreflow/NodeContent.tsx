import React, { useEffect, useState } from 'react';
import type { FlowNode, NodeInput } from './types';

type Props = { node: FlowNode };

export function NodeContent({ node }: Props) {
  const inputs = node.data?.inputs || [];

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    inputs.forEach(input => {
      if (input.name && node.data?.values?.[input.name]) {
        initial[input.name] = node.data.values[input.name];
      }
    });
    return initial;
  });

  useEffect(() => {
    node.data = {
      ...node.data,
      values,
    };
  }, [values]);

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const renderInput = (input: NodeInput, idx: number) => {
    const value = values[input.name] || '';

    switch (input.type) {
      case 'text':
      case 'number':
        return (
          <div key={idx} style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 12 }}>{input.name}</label>
            <input
              type={input.type}
              value={value}
              placeholder={input.placeholder}
              onChange={e => handleChange(input.name, e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              onDoubleClick={e => e.stopPropagation()}
              style={{ width: '100%', padding: 4, fontSize: 12 }}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={idx} style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 12 }}>{input.name}</label>
            <textarea
              value={value}
              placeholder={input.placeholder}
              onChange={e => handleChange(input.name, e.target.value)}
              rows={4}
              onMouseDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              onDoubleClick={e => e.stopPropagation()}
              style={{ width: '100%', padding: 4, fontSize: 12 }}
            />
          </div>
        );

      case 'select':
        return (
          <div key={idx} style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 12 }}>{input.name}</label>
            <select
              value={value}
              onChange={e => handleChange(input.name, e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              onDoubleClick={e => e.stopPropagation()}
              style={{ width: '100%', padding: 4, fontSize: 12 }}
            >
              {input.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={idx} style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 12 }}>
              <input
                type="checkbox"
                checked={value === 'true'}
                onChange={e => handleChange(input.name, e.target.checked ? 'true' : '')}
                onMouseDown={e => e.stopPropagation()}
                onClick={e => e.stopPropagation()}
                onDoubleClick={e => e.stopPropagation()}
                style={{ marginRight: 6 }}
              />
              {input.name}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <strong>{node.label}</strong>
      <div style={{ marginTop: 6 }}>
        {inputs.map(renderInput)}
      </div>
    </>
  );
}
