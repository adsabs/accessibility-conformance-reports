import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import { Support } from '@site/src/components/ConformanceBlock/Support';
import { NoSupport } from '@site/src/components/ConformanceBlock/NoSupport';
import { PartialSupport } from '@site/src/components/ConformanceBlock/PartialSupport';
import { Exception } from '@site/src/components/ConformanceBlock/Exception';
import { NonApplicable } from '@site/src/components/ConformanceBlock/NonApplicable';
import { Project } from '@site/src/components/Project';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Support,
  NoSupport,
  PartialSupport,
  NonApplicable,
  Exception,
  Project
};
