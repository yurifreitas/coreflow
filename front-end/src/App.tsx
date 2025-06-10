import { FlowProvider } from './coreflow/FlowProvider';
import FlowEngine from './coreflow/FlowEngine';
import FlowControls from './coreflow/FlowControls'; // ✅ novo

export default function App() {
  return (
    <FlowProvider>
      <FlowControls />
      <FlowEngine />
    </FlowProvider>
  );
}
