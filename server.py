import json
from http.server import HTTPServer, SimpleHTTPRequestHandler


class BadDataException(Exception):
    '''
    We sub-class the standard exception class, so that we have a unique
    "Exception" that our process_data function can raise if there are any
    problems with the data.

    This is important, because it lets us distinguish between 400 and 500
    errors.
    '''
    pass




def end_cash(beg_cash,revenue,expenses):
    years = list(range(0,5))
    yearEndCash = {}
    for year in years:
        if year == 0:
            yearEndCash[year] = beg_cash + revenue[year] - expenses[year]
        else:
            yearEndCash[year] = yearEndCash[year-1] + revenue[year] - expenses[year]

    return yearEndCash


def process_data(data):
    # ok, here we know the data sent to us follows the appropriate format
    return {
        "result": end_cash((data["begCash"]),(data["Revenue"]),(data["Expenses"]))
    }

class RequestHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            raw_request_data = self.rfile.read(content_length)
            request_data = json.loads(raw_request_data)
        except Exception as e:
            # a 400 HTTP response means that the client's request was poorly
            # formed; we print the error so we can debug it, and then tell the
            # client something was messed up
            print(e)
            self.send_response(400)

        try:
            print("processing: ", request_data)
            response_data = process_data(request_data)
            # 200 means all is well!
            self.send_response(200)
            self.end_headers()
            self.wfile.write(bytes(json.dumps(response_data), "utf-8"))
        except BadDataException as e:
            print(e)
            self.send_response(400)
        except Exception as e:
            print(e)
            # the 500 HTTP response code means that the server messed up
            self.send_response(500)


if __name__ == "__main__":
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, RequestHandler)
    httpd.serve_forever()
