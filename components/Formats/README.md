# FormatsPageContainer Component

A reusable component for displaying formats pages in both auditor and entity contexts.

## Usage

```jsx
import FormatsPageContainer from "@/components/Formats/FormatsPageContainer";

// For entity users (auditados)
<FormatsPageContainer
  userType="entity"
  title="Formatos Asignados"
  subtitle="Estos son los formatos asignados a tu entidad."
/>

// For auditors
<FormatsPageContainer
  userType="auditor"
  title="Formatos para Auditar"
  subtitle="Estos son los formatos asignados para tu revisión."
/>
```

## Props

| Prop       | Type                    | Required | Description                                                     |
| ---------- | ----------------------- | -------- | --------------------------------------------------------------- |
| `userType` | `'auditor' \| 'entity'` | Yes      | Determines the behavior and appearance for different user types |
| `title`    | `string`                | Yes      | The main title displayed in the header                          |
| `subtitle` | `string`                | Yes      | The subtitle displayed in the header                            |

## Features

### Common Features

- Data loading with appropriate API calls based on user type
- Search functionality by format name
- Area filtering
- Status filtering (asignado, pendiente, faltante, aprobado)
- Statistics display with color-coded cards
- Due date visualization with color coding
- Details drawer for each format
- Responsive design

### Entity-specific Features

- Shows entity name in header
- Displays auditor information in table and details
- Button actions:
  - "Llenar" for `asignado` status
  - "En revisión" (disabled) for `pendiente` status
  - "Revisar" for `faltante` status
  - "Ver" for `aprobado` status
- Routes to `/audit/formats/{id}`

### Auditor-specific Features

- Shows auditor name in header
- Additional entity column and filter
- Button actions:
  - "Auditar" for `pendiente` status
  - "Ver" for all other statuses
- Routes to `/auditor/formats/{id}`

## Dependencies

- React hooks: `useState`, `useEffect`, `useMemo`
- Next.js: `useRouter`
- Custom hooks: `useFetchUser`, `useUsers`, `useEntitiesFormats`, `useFormatEntries`
- Ant Design components
- dayjs for date handling
- Shared components: `AuditHeader`, `AuditAssignmentTable`, `AuditAssignmentDetails`, `AuditStats`
