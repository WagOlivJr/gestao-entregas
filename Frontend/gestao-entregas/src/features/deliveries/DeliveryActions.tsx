// import type { Delivery } from "../entities/Delivery";

// ;

// interface DeliveryActionsProps {
//     delivery: Delivery;
// }

// export function DeliveryActions({
//     delivery,
// }: DeliveryActionsProps) {
//     const currentIndex = STATUS_SEQUENCE.indexOf(
//         delivery.status,
//     );

//     const nextStatusCode =
//         STATUS_SEQUENCE[currentIndex + 1];

//     const nextStatus = nextStatusCode
//         ? STATUS_LABELS[nextStatusCode]
//         : undefined;

//     const canEdit = !CLOSED_STATUSES.includes(
//         delivery.status,
//     );

//     const actions: ActionConfig[] = [
//         {
//             key: "next-status",
//             text: "Mudar status",
//             icon: "fa fa-arrow-right",
//             className:
//                 "status-progress actions-btns__btn--next-status",
//             disabled: !canEdit,
//             title: canEdit
//                 ? `Progredir status da entrega para: ${nextStatus}`
//                 : "Não é possível alterar entregas finalizadas",
//             onClick: () => {
//                 console.log(
//                     "Mudar status:",
//                     delivery.id,
//                 );
//             },
//         },
//         {
//             key: "details",
//             text: "Detalhes",
//             icon: "fa fa-info-circle",
//             className:
//                 "actions-btns__btn--see-details",
//             title: "Visualizar detalhes desta entrega",
//             onClick: () => {
//                 console.log(
//                     "Detalhes:",
//                     delivery.id,
//                 );
//             },
//         },
//         {
//             key: "edit",
//             text: "Editar",
//             icon: "fa fa-edit",
//             className:
//                 "actions-btns__btn--edit",
//             disabled: !canEdit,
//             title: canEdit
//                 ? "Editar entrega"
//                 : "Não é possível alterar entregas finalizadas",
//             onClick: () => {
//                 console.log(
//                     "Editar:",
//                     delivery.id,
//                 );
//             },
//         },
//         {
//             key: "products",
//             text: "Ver produtos",
//             icon: "fa fa-cart-shopping",
//             className:
//                 "actions-btns__btn--see-products",
//             title: "Visualizar produtos desta entrega",
//             onClick: () => {
//                 console.log(
//                     "Produtos:",
//                     delivery.id,
//                 );
//             },
//         },
//         {
//             key: "cancel",
//             text: "Cancelar",
//             icon: "fa fa-circle-xmark",
//             className:
//                 "actions-btns__btn--cancel",
//             disabled: !canEdit,
//             title: canEdit
//                 ? "Cancelar entrega"
//                 : "Não é possível alterar entregas finalizadas",
//             onClick: () => {
//                 console.log(
//                     "Cancelar:",
//                     delivery.id,
//                 );
//             },
//         },
//         {
//             key: "delete",
//             text: "Excluir",
//             icon: "fa fa-trash",
//             className:
//                 "actions-btns__btn--delete",
//             title: "Excluir entrega",
//             onClick: () => {
//                 console.log(
//                     "Excluir:",
//                     delivery.id,
//                 );
//             },
//         },
//     ];

//     return <ActionsMenu actions={actions} />;
// }
