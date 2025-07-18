import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import { Support } from '@site/src/components/ConformanceBlock/Support';
import { Unknown } from '@site/src/components/ConformanceBlock/Unknown';
import { NoSupport } from '@site/src/components/ConformanceBlock/NoSupport';
import { PartialSupport } from '@site/src/components/ConformanceBlock/PartialSupport';
import { Exception } from '@site/src/components/ConformanceBlock/Exception';
import { NotApplicable } from '@site/src/components/ConformanceBlock/NotApplicable';
import { Project } from '@site/src/components/Project';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Support,
  Unknown,
  NoSupport,
  PartialSupport,
  NotApplicable,
  Exception,
  Project
};
