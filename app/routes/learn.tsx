import type {MetaFunction} from 'react-router';

import '../styles/pages/hello.css';

export const meta: MetaFunction = () => {
  return [{title: 'Hello'}];
};

export default function LearnPage() {
  return (
    <div className="hello-page">
      <h1>Learn world</h1>
    </div>
  );
}
