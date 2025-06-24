# Project Specific
- Use Recharts for charts.
- Use SWR with ofetch for API calls.
- No mock/example data allowed.
- Focus on modern design with proper TypeScript and React best practices.
- Create a chatlogApiClient for the frontend to connect to the chatlog backend API (separate from analysis backend) - reference Python client shows endpoints like /api/v1/chatlog, /api/v1/contact, /api/v1/chatroom, /api/v1/session.
- TaskResponse and related types should be deleted from current location and migrated to types/task-response directory instead.
- AnalysisResultsSocialNetworkSchema needs mention_network field with MentionNetworkSchema, and VisualizationEdgeSchema needs reply_count, mention_count, mentioned_users, has_mentions fields for mention network functionality.
- User prefers WebSocket-only approach and questions the need for polling when WebSocket connection is already established.
- Backend API schema includes comprehensive endpoints for health checks, user cache management, task management, model operations, system stats, and analyzers with detailed Zod schemas for request/response validation.
- User prefers breaking changes over backward compatibility when fixing TypeScript errors - delete old/enhanced compatibility code and use latest API specs directly.
- For API type synchronization, fetch OpenAPI spec from backend, break down monolithic types.ts into modular domain-specific files, make breaking changes without backward compatibility concerns, and ensure perfect alignment with backend API specification.
- Analyzers API response contains analyzer_info object with detailed metadata including description, category, class_info, init_params, and is_registered status for each analyzer.

# Design Preferences
- Use vaul Drawer components for modals.
- Use Framer Motion for animations and transitions.
- Use icon libraries instead of emoji for all UI components.
- Prefer denser UI layouts with higher information density and less whitespace in selection components (referencing StatusBar as good example).
- For word frequency and similar ranking data, prefer horizontal bar charts over vertical ones for better readability.
- User finds current dark color scheme has poor readability.

# chatlog-analyser-frontend Specific Design
- Avoid shadows and fake 3D effects.
- Prefer flat design.
- Avoid shadcn/ui Card components.
- Avoid traditional sidebar+main dashboard layouts.
- Use Framer Motion for animations (don't mix with CSS transitions).
- Focus on visual details.
- Analysis details page should use WebSocket connections for real-time progress updates, integrate with chatlog backend API SDK, and follow project's flat design principles with vaul Drawer components and icon libraries.
- Analysis center should display a list of analysis tasks rather than appearing empty when no task is selected.
- Use Shadcn UI components for settings pages and reference Shadcn UI documentation via Context7 when needed.
- StatusBar should include system statistics, model management, preload management, and user cache management modules using respective SDK APIs with proper loading states and error handling.
- User expects loading states to be properly utilized in UI components when they are defined but not used.
- For chart components, implement 'view all' functionality with clickable icons (not emoji) in top-right corner, use Framer Motion for smooth expand/collapse animations, show complete datasets when expanded, maintain flat design without shadows/3D effects, and ensure TypeScript safety.
- For expandable charts, use absolute positioning with calculated position to prevent page layout changes when expanding, and ensure overlay/masking works correctly without affecting other page elements.
- For expandable charts, user prefers Framer Motion over CSS transitions/View Transition API for smoother chart animations when performance feels laggy.
- User prefers expandable chart components to have proper height constraints that don't exceed the expanded container size, and smooth closing animations instead of abrupt transitions.
- For route pages, use Chinese titles that reflect specific functionality, maintain consistent naming conventions, ensure TypeScript compliance for metadata configuration, and consider adding descriptions for important pages.

# Performance Considerations
- For emotional time series with large datasets, implement asynchronous rendering to prevent page lag instead of rendering all data at once.

# Development Process
- Use Playwright for diagnostics and testing when debugging UI issues.