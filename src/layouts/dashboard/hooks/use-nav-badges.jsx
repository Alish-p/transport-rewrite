import { paths } from 'src/routes/paths';

import { useTasks } from 'src/query/use-task';
import { usePaginatedWorkOrders } from 'src/query/use-work-order';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function useNavBadges() {
  const { data: tasks } = useTasks();
  const { data: workOrdersData } = usePaginatedWorkOrders({ page: 1, rowsPerPage: 1 });

  // Map route paths to their corresponding live counts
  const badgeCounts = {
    [paths.dashboard.kanban]: (tasks?.todo?.length || 0) + (tasks?.['in-progress']?.length || 0),
    [paths.dashboard.workOrder.root]:
      (workOrdersData?.totals?.open?.count || 0) + (workOrdersData?.totals?.pending?.count || 0),
  };

  const injectBadges = (navSections) => {
    if (!navSections) return [];

    return navSections.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        const count = badgeCounts[item.path];

        if (count && count > 0) {
          return {
            ...item,
            info: (
              <Label variant="soft" color="error">
                {count}
              </Label>
            ),
          };
        }

        return item;
      }),
    }));
  };

  return { injectBadges };
}
