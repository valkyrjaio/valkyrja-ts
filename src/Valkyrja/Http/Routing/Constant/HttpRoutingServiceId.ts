export class HttpRoutingServiceId {
    static readonly RouterContract = 'Valkyrja.Http.Routing.Dispatcher.RouterContract' as const;
    static readonly RouteCollectionContract = 'Valkyrja.Http.Routing.Collection.RouteCollectionContract' as const;
    static readonly RouteCollectorContract = 'Valkyrja.Http.Routing.Collector.RouteCollectorContract' as const;
    static readonly MatcherContract = 'Valkyrja.Http.Routing.Matcher.MatcherContract' as const;
    static readonly ProcessorContract = 'Valkyrja.Http.Routing.Processor.ProcessorContract' as const;
    static readonly RoutingResponseFactory = 'Valkyrja.Http.Routing.Factory.RoutingResponseFactoryContract' as const;
    static readonly UrlContract = 'Valkyrja.Http.Routing.Url.UrlContract' as const;
    static readonly RouteContract = 'Valkyrja.Http.Routing.Data.RouteContract' as const;
    static readonly HttpRoutingData = 'Valkyrja.Http.Routing.Data.HttpRoutingData' as const;
    static readonly ListCommand = 'Valkyrja.Http.Routing.Cli.Command.ListCommand' as const;
}
