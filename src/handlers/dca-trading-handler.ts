import 'source-map-support/register';
import { DcaTradingEventScheduler } from '../code/application/dca-trading/dca-trading-event-scheduler';
import { Context, ScheduledEvent } from 'aws-lambda';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { BinanceClient } from '../code/infrastructure/binance/binance-client';
import { ProcessDcaTradingService } from '../code/domain/dca-trading/process-dca-trading-service';
import { DcaTradingConfig } from '../code/domain/dca-trading/model/dca-trading';
import { HttpOrderRepository } from '../code/infrastructure/order/http-order-repository';
import { CreateOrderService } from '../code/domain/order/create-order-service';
import { handleEvent } from './handler-utils';
import { DdbDcaTradingRepository } from '../code/infrastructure/dca-trading/ddb-dca-trading-repository';

const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.REGION }), { marshallOptions: { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true } });
const smClient = new SecretsManagerClient({ region: process.env.REGION });

const binanceClient = new BinanceClient(smClient, process.env.BINANCE_SECRET_NAME, process.env.BINANCE_URL);

const orderRepository = new HttpOrderRepository(binanceClient);
const createOrderService = new CreateOrderService(orderRepository);

const dcaTradingConfig = JSON.parse(process.env.DCA_TRADING_CONFIG) as DcaTradingConfig;
const dcaTradingRepository = new DdbDcaTradingRepository(process.env.TRADING_TABLE_NAME, ddbClient);
const processDcaTradingService = new ProcessDcaTradingService(createOrderService, dcaTradingRepository);

const dcaTradingScheduler = new DcaTradingEventScheduler(processDcaTradingService, dcaTradingConfig);

export const handler = async (event: ScheduledEvent, context: Context): Promise<void> => {
  return handleEvent(context, async () => dcaTradingScheduler.process());
};
