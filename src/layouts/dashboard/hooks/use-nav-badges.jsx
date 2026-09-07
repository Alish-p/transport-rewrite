import { paths } from 'src/routes/paths';

import { useTasks } from 'src/query/use-task';
import { usePaginatedWorkOrders } from 'src/query/use-work-order';
import { useVehicleDocumentsSummary } from 'src/query/use-dashboard';
import { useWhatsAppConversations } from 'src/query/use-whatsapp';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function useNavBadges() {
  const { data: tasks } = useTasks();
  const { data: workOrdersData } = usePaginatedWorkOrders({ page: 1, rowsPerPage: 1 });
  const { data: vehicleDocsSummary } = useVehicleDocumentsSummary();
  const { data: whatsappData } = useWhatsAppConversations({}, { refetchInterval: 30000 });

  const totalWhatsAppUnread = whatsappData?.data?.reduce((sum, c) => sum + (c.unreadCount || 0), 0) || 0;

  // Map route paths to their corresponding live counts
  const badgeCounts = {
    [paths.dashboard.kanban]: (tasks?.todo?.length || 0) + (tasks?.['in-progress']?.length || 0),
    [paths.dashboard.workOrder.root]:
      (workOrdersData?.totals?.open?.count || 0) + (workOrdersData?.totals?.pending?.count || 0),
    [paths.dashboard.vehicle.documents]: vehicleDocsSummary?.expired || 0,
    [paths.dashboard.whatsapp]: totalWhatsAppUnread,
  };

  const injectBadges = (navSections) => {
    if (!navSections) return [];

    const injectToItem = (item) => {
      const count = badgeCounts[item.path];
      const updatedItem = { ...item };

      if (count && count > 0) {
        updatedItem.info = (
          <Label variant="soft" color="error">
            {count}
          </Label>
        );
      }

      if (item.children) {
        updatedItem.children = item.children.map(injectToItem);
      }

      return updatedItem;
    };

    return navSections.map((section) => ({
      ...section,
      items: section.items.map(injectToItem),
    }));
  };

  return { injectBadges };
}

