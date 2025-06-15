import { modeType } from "../notification/notification.interface";
import { notificationServices } from "../notification/notification.service";

  // Helper function to calculate average response time
  export const calculateAverageResponseTime = (timeTaken: number, serviceProvider:any) => {
    return (
      (serviceProvider.averageResponseTime * serviceProvider.totalResponses +
        timeTaken) /
      (serviceProvider.totalResponses + 1)
    );
  };

  // Helper function to insert notifications
  export const sendNotification = (
    receiver: string,
    message: string,
    description: string,
    reference: string,
  ) => {
    notificationServices.insertNotificationIntoDb({
      receiver,
      message,
      description,
      refference: reference,
      model_type: modeType.Contract,
    });
  };